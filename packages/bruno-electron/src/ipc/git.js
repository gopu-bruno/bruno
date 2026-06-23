const { ipcMain } = require('electron');
const path = require('path');
const { cloneGitRepository, getCollectionGitRootPath, getCollectionGitRepoUrl } = require('../utils/git');
const { createDirectory, removeDirectory } = require('../utils/filesystem');

// Normalize any git remote (ssh/https, with/without .git) to a github https URL.
const toHttpsRepo = (remote) => {
  if (!remote) return null;
  const m = String(remote).match(/github\.com[/:]([^/]+)\/([^/.\s]+)/i);
  if (m) return `https://github.com/${m[1]}/${m[2].replace(/\.git$/, '')}`;
  return String(remote).trim().replace(/\.git$/, '') || null;
};
const ownerOf = (httpsRepo) => {
  const m = String(httpsRepo || '').match(/github\.com\/([^/]+)/i);
  return m ? m[1] : null;
};

const registerGitIpc = (mainWindow) => {
  ipcMain.handle('renderer:clone-git-repository', async (event, { url, path, processUid, ref }) => {
    let directoryCreated = false;
    try {
      await createDirectory(path);
      directoryCreated = true;
      await cloneGitRepository(mainWindow, { url, path, processUid, ref });
      return 'Repository cloned successfully';
    } catch (error) {
      if (directoryCreated) {
        await removeDirectory(path);
      }
      return Promise.reject(error);
    }
  });

  // Resolve a collection's git remote + its path within that repo, so the
  // publish flow can prefill the source repo (and tag-prefix subdir) from a
  // picked workspace collection. Returns nulls when the collection isn't a git
  // repo / has no origin — the user can still fill the fields manually.
  ipcMain.handle('renderer:get-collection-git-info', async (event, { pathname } = {}) => {
    try {
      if (!pathname) return { remote: null, subdir: null, owner: null };
      const gitRootPath = getCollectionGitRootPath(pathname);
      if (!gitRootPath) return { remote: null, subdir: null, owner: null };

      let remoteRaw = null;
      try {
        remoteRaw = await getCollectionGitRepoUrl(gitRootPath);
      } catch (e) {
        // no 'origin' remote configured — fall through with null
      }
      const remote = toHttpsRepo(remoteRaw);

      let subdir = path.relative(gitRootPath, pathname).replace(/\\/g, '/');
      if (subdir === '' || subdir === '.') subdir = null;

      return { remote, subdir, owner: ownerOf(remote) };
    } catch (e) {
      return { remote: null, subdir: null, owner: null };
    }
  });
};

module.exports = registerGitIpc;
