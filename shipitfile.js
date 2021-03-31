// shipit production deploy
module.exports = (shipit) => {
  // Load shipit-deploy tasks
  require("shipit-deploy")(shipit);

  shipit.initConfig({
    default: {
      deployTo: "/home/deploy",
      // repositoryUrl: 'https://github.com/Timikcool/tezos-mandala',
      keepReleases: 2,
      ignores: [".git", "node_modules", "src", "public"],
    },
    production: {
      servers: "deploy@tezos-mandala.art",
      branch: "master",
    },
  });
  shipit.blTask("copy-build", async () => {
    // await shipit.local("npm run build");
    await shipit.copyToRemote("build", "/home/deploy");
  });
};
