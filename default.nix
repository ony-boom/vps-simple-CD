{bun2nix, ...}:
bun2nix.mkDerivation {
  packageJson = ./package.json;
  pname = "ony-boom-cd";
  src = ./.;

  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };
}
