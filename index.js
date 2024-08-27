import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import chalk from 'chalk';

const git = simpleGit();

async function isGitRepository() {
  try {
    await git.revparse(['--is-inside-work-tree']);
    return true;
  } catch (error) {
    return false;
  }
}

async function showMenu() {
  const isRepo = await isGitRepository();
  if (!isRepo) {
    console.log(chalk.red('Error: The current directory is not a Git repository.'));
    return;
  }

  const { command } = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Choose a git command:',
      choices: ['Status', 'Branch', 'Commit', 'Push', 'Pull'],
    },
  ]);

  switch (command) {
    case 'Status':
      await showStatus();
      break;
    case 'Branch':
      await manageBranches();
      break;
    case 'Commit':
      await commitChanges();
      break;
    case 'Push':
      await pushChanges();
      break;
    case 'Pull':
      await pullChanges();
      break;
    default:
      console.log(chalk.red('Command not implemented yet.'));
  }

  // Show the menu again after the command is executed
  showMenu();
}

async function showStatus() {
  try {
    const status = await git.status();
    console.log(chalk.green('Git Status:\n'), status);
  } catch (error) {
    console.log(chalk.red('Error fetching status:', error.message));
  }
}

async function manageBranches() {
  const { branchCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'branchCommand',
      message: 'Choose a branch command:',
      choices: ['List Branches', 'Create Branch', 'Delete Branch', 'Switch Branch'],
    },
  ]);

  switch (branchCommand) {
    case 'List Branches':
      await listBranches();
      break;
    case 'Create Branch':
      await createBranch();
      break;
    case 'Delete Branch':
      await deleteBranch();
      break;
    case 'Switch Branch':
      await switchBranch();
      break;
    default:
      console.log(chalk.red('Command not implemented yet.'));
  }
}

async function listBranches() {
  try {
    const branches = await git.branch();
    console.log(chalk.blue('Branches:\n'), branches.all);
  } catch (error) {
    console.log(chalk.red('Error listing branches:', error.message));
  }
}

async function createBranch() {
  const { branchName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'branchName',
      message: 'Enter the new branch name:',
    },
  ]);

  try {
    await git.checkoutLocalBranch(branchName);
    console.log(chalk.green(`Branch ${branchName} created and switched to.`));
  } catch (error) {
    console.log(chalk.red('Error creating branch:', error.message));
  }
}

async function deleteBranch() {
  try {
    const branches = await git.branch();
    const { branchName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'branchName',
        message: 'Choose a branch to delete:',
        choices: branches.all.filter((branch) => !branch.startsWith('*')),
      },
    ]);

    await git.deleteLocalBranch(branchName);
    console.log(chalk.green(`Branch ${branchName} deleted.`));
  } catch (error) {
    console.log(chalk.red('Error deleting branch:', error.message));
  }
}

async function switchBranch() {
  try {
    const branches = await git.branch();
    const { branchName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'branchName',
        message: 'Choose a branch to switch to:',
        choices: branches.all.filter((branch) => !branch.startsWith('*')),
      },
    ]);

    await git.checkout(branchName);
    console.log(chalk.green(`Switched to branch ${branchName}.`));
  } catch (error) {
    console.log(chalk.red('Error switching branch:', error.message));
  }
}

async function commitChanges() {
  const { commitMessage } = await inquirer.prompt([
    {
      type: 'input',
      name: 'commitMessage',
      message: 'Enter the commit message:',
    },
  ]);

  try {
    await git.commit(commitMessage);
    console.log(chalk.green(`Changes committed with message: ${commitMessage}`));
  } catch (error) {
    console.log(chalk.red('Error committing changes:', error.message));
  }
}

async function pushChanges() {
  const { remote } = await inquirer.prompt([
    {
      type: 'input',
      name: 'remote',
      message: 'Enter the remote name (default is origin):',
      default: 'origin',
    },
  ]);

  try {
    await git.push(remote);
    console.log(chalk.green(`Changes pushed to ${remote}.`));
  } catch (error) {
    console.log(chalk.red('Error pushing changes:', error.message));
  }
}

async function pullChanges() {
  const { remote } = await inquirer.prompt([
    {
      type: 'input',
      name: 'remote',
      message: 'Enter the remote name (default is origin):',
      default: 'origin',
    },
  ]);

  try {
    await git.pull(remote);
    console.log(chalk.green(`Changes pulled from ${remote}.`));
  } catch (error) {
    console.log(chalk.red('Error pulling changes:', error.message));
  }
}

showMenu();
