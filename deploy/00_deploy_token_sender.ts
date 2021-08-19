import { DeployFunction } from 'hardhat-deploy/types';

const deploy: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  await deploy('TokenSender', {
    from: deployer,
    log: true,
  });
};

export default deploy;
