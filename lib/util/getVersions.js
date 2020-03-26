const semver = require('semver');
const execa = require('execa');

let sessionCached;
const bin = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
module.exports = async function getVersions () {
  if (sessionCached) {
    return sessionCached;
  }
  const local = require(`../../package.json`).version;
  // should also check for prerelease versions if the current one is a prerelease
  const includePrerelease = !!semver.prerelease(local);
  const latest = await getLatestVersion('@leafs/cli', includePrerelease);
  return (sessionCached = {
    current: local,
    latest
  });
}

async function getLatestVersion (packageName, includePrerelease) {
  let version = await getRemoteVersion(packageName, 'latest');

  if (includePrerelease) {
    const next = await getRemoteVersion(packageName, 'next');
    version = semver.gt(next, version) ? next : version;
  }

  return version;
}

async function getRemoteVersion (packageName, versionRange = 'latest') {
  const metadata = await getMetadata(packageName);
  if (Object.keys(metadata['dist-tags']).includes(versionRange)) {
    return metadata['dist-tags'][versionRange];
  }
  const versions = Array.isArray(metadata.versions) ? metadata.versions : Object.keys(metadata.versions);
  return semver.maxSatisfying(versions, versionRange);
}

async function getMetadata (packageName, { field = '' } = {}) {
  const args = ['info', packageName, field, '--json'];
  const { stdout } = await execa(bin, args);
  metadata = JSON.parse(stdout);
  return metadata;
}
