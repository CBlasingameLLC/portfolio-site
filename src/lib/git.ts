import { execFileSync } from 'node:child_process';

const today = new Date().toISOString().slice(0, 10);

function git(args: string[]): string {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

/** Date (YYYY-MM-DD) of the last commit touching `path`, relative to the repo root. Falls back to the build date. */
export function lastModified(path: string): string {
  return git(['log', '-1', '--format=%cs', '--', path]) || today;
}

/** Short hash of HEAD, shown as REV in the title block. */
export function shortRev(): string {
  return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || git(['rev-parse', '--short=7', 'HEAD']) || 'dev';
}
