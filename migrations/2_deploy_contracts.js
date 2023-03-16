const HelloWorld = artifacts.require("helloworld");
const Evoting = artifacts.require("evoting");

module.exports = function(deployer) {
  deployer.deploy(Evoting);
};
