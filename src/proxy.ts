import { NextRequest, NextResponse } from 'next/server';

/**
 * NIMORA Edge WAF & Automated Probe Blocker
 * Blocks the Top 9 Automated Scanner & Hacking Probes (Reel #9: @vikasbuildsapp):
 * 1. Environment files (.env*)
 * 2. WordPress / CMS probes (wp-login, wp-admin, xmlrpc)
 * 3. Script & backdoor candidates (.php, .asp, .jsp, .cgi)
 * 4. Git & CI metadata (.git, .svn, .gitlab-ci.yml)
 * 5. Debug & server info (actuator, server-status, phpinfo)
 * 6. Backups & database dumps (.sql, .bak, .tar.gz)
 * 7. Cloud & SSH credentials (.aws, .ssh, id_rsa)
 * 8. Predictable /admin & management routes
 * 9. Encoded & path traversal attempts (../, %2e%2e, null bytes)
 */

const BLOCKED_PATH_PATTERNS: RegExp[] = [
  /\/\.env/i,
  /\/wp-(?:login|admin|content|includes|json)|\/xmlrpc\.php/i,
  /\.(?:php|asp|aspx|jsp|cgi|pl)(?:$|\/|\?)/i,
  /\/\.(?:git|svn|hg|bzr|docker|aws|ssh)(?:$|\/)/i,
  /\/(?:id_rsa|id_ed25519|\.htpasswd|\.htaccess)/i,
  /\/(?:actuator|server-status|phpinfo|_profiler|telescope|horizon)(?:$|\/)/i,
  /\.(?:sql|bak|old|orig|swp|dist|tar\.gz|tgz)(?:$|\?)/i,
  /^\/(?:admin|administrator|phpmyadmin|pma|cpanel|webmail)(?:$|\/)/i,
  /(?:\.\.\/|\.\.\\|%2e%2e|%00)/i,
];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const fullTarget = `${pathname}${search}`;

  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(fullTarget)) {
      console.warn(
        JSON.stringify({
          ts: new Date().toISOString(),
          service: 'nimora-edge-waf',
          event: 'waf.probe.blocked',
          path: pathname,
          ip: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown',
        })
      );

      return new NextResponse(
        JSON.stringify({ error: 'Forbidden', code: 'WAF_PROBE_BLOCKED' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'X-WAF-Blocked': 'nimora-edge-shield',
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-192.png|icon-512.png|manifest.json).*)'],
};
