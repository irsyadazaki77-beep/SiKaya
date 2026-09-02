import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Helper to set up guest/demo authenticated state
async function setupAuthenticatedState(page: any) {
  await page.addInitScript(() => {
    window.localStorage.setItem('demo_token', 'demo-token');
    window.localStorage.setItem('guest_profile', JSON.stringify({
      fullName: 'Siswa Tamu (Demo)',
      email: 'guest@sikaya.com',
      avatar: '🦊',
      literacyLevel: 'Pemula',
      xp: 150,
      completedModules: []
    }));
  });
}

test.describe('SiKaya Public & Navigation Flows', () => {
  test('homepage loads successfully with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SiKaya/);
    await expect(page.getByText('Edukasi Finansial', { exact: false }).first()).toBeVisible();
  });

  test('features page renders details and benefits', async ({ page }) => {
    await page.goto('/features');
    await expect(page.getByText('Fitur Unggulan', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Simulasi Investasi', { exact: false }).first()).toBeVisible();
  });

  test('404 page renders clean "Not Found" message', async ({ page }) => {
    await page.goto('/halaman-tidak-ditemukan');
    await expect(page.getByText(/404|Tidak Ditemukan/i)).toBeVisible();
  });

  test('desktop navigation links are visible on widescreen', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // Standard links should be present on desktop
    await expect(page.getByRole('link', { name: 'Fitur' }).first()).toBeVisible();
  });
});

test.describe('SiKaya Authentication Flows', () => {
  test('login UI renders alternative entry buttons correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Masuk dengan Google')).toBeVisible();
    await expect(page.getByText('Masuk Instan sebagai Tamu (Demo)')).toBeVisible();
  });

  test('invalid / unauthenticated auth state triggers protected page gates', async ({ page }) => {
    // Navigate directly to protected page without auth
    await page.goto('/simulasi');
    // Should display a login prompt or demo gate instead of the main interactive charts
    await expect(page.getByText(/Login/i).first()).toBeVisible();
  });

  test('instant guest login and logout flow', async ({ page }) => {
    await page.goto('/login');
    // Click Masuk Instan
    const guestBtn = page.getByRole('button', { name: 'Masuk Instan sebagai Tamu (Demo)' });
    await guestBtn.click();
    
    // Redirected to homepage or dashboard in logged-in state
    await page.waitForURL('/');
    // Profile or user info should be shown
    await expect(page.getByText('Siswa Tamu (Demo)')).toBeVisible();

    // Perform Logout (using header user menu or directly clearing localstorage to simulate)
    await page.evaluate(() => {
      window.localStorage.removeItem('demo_token');
      window.localStorage.removeItem('guest_profile');
      window.location.reload();
    });
    
    await expect(page.getByText('Siswa Tamu (Demo)')).not.toBeVisible();
  });
});

test.describe('SiKaya AI Advisor Flows', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
  });

  test('submit button disabled when question is empty', async ({ page }) => {
    await page.goto('/ai-advisor');
    const submitBtn = page.locator('form button[type="submit"]');
    await expect(submitBtn).toBeDisabled();
  });

  test('handles authenticated question flow and loading state', async ({ page }) => {
    // Intercept API call to return a mock AI answer
    await page.route('/api/chat', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'Analisis Keuangan: Pendapatan Anda sehat. Pertahankan rasio tabungan 30%.'
        })
      });
    });

    await page.goto('/ai-advisor');
    const input = page.getByPlaceholder('Ketik pertanyaan terkait finansial di sini...');
    await input.fill('Bagaimana kondisi finansial saya saat ini?');

    const submitBtn = page.locator('form button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
    
    await submitBtn.click();
    
    // While loading, input should be disabled
    await expect(input).toBeDisabled();
    
    // Wait for response to appear
    await expect(page.getByText('Analisis Keuangan')).toBeVisible();
  });

  test('handles failed AI responses gracefully with user-friendly errors', async ({ page }) => {
    await page.route('/api/chat', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Gemini service overloaded' })
      });
    });

    await page.goto('/ai-advisor');
    const input = page.getByPlaceholder('Ketik pertanyaan terkait finansial di sini...');
    await input.fill('Bagaimana rasio utang saya?');
    await page.locator('form button[type="submit"]').click();

    // Verify error toast or error text is displayed
    await expect(page.getByText(/gagal|error|gangguan/i).first()).toBeVisible();
  });

  test('handles timeout or aborted responses cleanly', async ({ page }) => {
    // Route aborts or times out
    await page.route('/api/chat', async (route) => {
      await route.abort('timedout');
    });

    await page.goto('/ai-advisor');
    const input = page.getByPlaceholder('Ketik pertanyaan terkait finansial di sini...');
    await input.fill('Berapa dana darurat ideal?');
    await page.locator('form button[type="submit"]').click();

    await expect(page.getByText(/gagal|error|timeout/i).first()).toBeVisible();
  });
});

test.describe('SiKaya Market Data Flows', () => {
  test('displays real-time stock prices successfully', async ({ page }) => {
    await page.route('/api/stock-prices', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          data: [
            { symbol: 'BBCA.JK', name: 'Bank Central Asia', price: 10200, change: 1.5, changePercent: 1.48 }
          ]
        })
      });
    });

    await page.goto('/');
    // Check if the mock stock data is loaded into lists
    await expect(page.getByText('BBCA.JK').first()).toBeVisible();
  });

  test('shows simulated mode label when service is running mock engine', async ({ page }) => {
    await page.route('/api/stock-prices', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'simulated',
          data: [
            { symbol: 'BBCA.JK', name: 'Bank Central Asia (Simulasi)', price: 10000, change: 0, changePercent: 0 }
          ]
        })
      });
    });

    await page.goto('/');
    await expect(page.getByText(/simulasi|simulated/i).first()).toBeVisible();
  });

  test('shows stale data indicator when provider is unavailable', async ({ page }) => {
    await page.route('/api/stock-prices', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'stale',
          data: [
            { symbol: 'BBRI.JK', name: 'Bank Rakyat Indonesia', price: 4800, change: -0.5, changePercent: -0.1 }
          ]
        })
      });
    });

    await page.goto('/');
    await expect(page.getByText(/stale|terlambat/i).first()).toBeVisible();
  });
});

test.describe('SiKaya Portfolio Flows', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
  });

  test('renders empty portfolio state or empty charts initially', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.getByText(/kosong|belum ada transaksi|mulai investasi/i).first()).toBeVisible();
  });
});

test.describe('SiKaya Classroom Flows', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
  });

  test('can load and navigate learning modules', async ({ page }) => {
    await page.goto('/belajar');
    // Verify first module card is rendered
    await expect(page.getByText('Pilar Keuangan', { exact: false }).first()).toBeVisible();
  });
});

// Viewport and responsive tests
const viewports = [
  { width: 360, height: 800, type: 'mobile' },
  { width: 390, height: 844, type: 'mobile' },
  { width: 768, height: 1024, type: 'tablet' },
  { width: 1366, height: 768, type: 'desktop' },
  { width: 1440, height: 900, type: 'desktop' }
];

test.describe('SiKaya Responsive Layout Tests', () => {
  for (const vp of viewports) {
    test(`render correctly on ${vp.width}x${vp.height} (${vp.type})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Check horizontal overflow (no scrollbars)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(vp.width + 1); // allow 1px rounding offset

      if (vp.type === 'mobile') {
        // Bottom nav or hamburger should be accessible
        const bottomNav = page.locator('nav').last();
        await expect(bottomNav).toBeVisible();
      } else {
        // Desktop header
        await expect(page.getByRole('link', { name: 'Fitur' }).first()).toBeVisible();
      }
    });
  }
});

// Accessibility smoke tests using axe-core
test.describe('SiKaya Accessibility Smoke Tests', () => {
  test('homepage has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Filter to critical violations only to ensure a reliable pipeline
    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    console.log(`[A11y] Homepage critical violations: ${criticalViolations.length}`);
    expect(criticalViolations.length).toBe(0);
  });

  test('login page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/login');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    console.log(`[A11y] Login page critical violations: ${criticalViolations.length}`);
    expect(criticalViolations.length).toBe(0);
  });

  test('ai advisor page has no critical accessibility violations', async ({ page }) => {
    await setupAuthenticatedState(page);
    await page.goto('/ai-advisor');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    console.log(`[A11y] AI Advisor critical violations: ${criticalViolations.length}`);
    expect(criticalViolations.length).toBe(0);
  });
});
