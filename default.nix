{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
    name = "three js experiment";
    buildInputs = [ pkgs.nodejs ];
    buildPhase = ''
        npm install
    '';

    installPhase = ''
        mkdir -p $out
        cp -r * $out
    '';
}
