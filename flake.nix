{ pkgs }:

{
    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs";
    };

    outputs = { self, nixpkgs }:
        let
            # Import the nixpkgs set
            pkgs = import nixpkgs { inherit system; };

            # Use the nodejs attribute from pkgs
            nodejs = pkgs.nodejs;
        in
        {
            # Your code here
        };
}
