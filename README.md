# GitHub Telegram Bot

A Telegram bot to easily manage your GitHub repositories.

## Installation

```bash
git clone <repo>
cd github-telegram-bot
npm install
cp .env.example .env
# Fill in your tokens in the .env file
```

## Usage

Start the bot:

```bash
npm start
```

## Available Commands

- `/createrepo <name> <public|private>`  
  Create a GitHub repository.

- `/listrepos`  
  List your repositories (pagination possible).

- `/deleterepo <repo>`  
  Delete a repository.

- `/addcollab <repo> <user>`  
  Add a collaborator to a repository.

- `/listcollab <repo>`  
  List collaborators of a repository.

- `/createissue <repo> | <title> | <description>`  
  Create an issue in a repository.

- `/listissues <repo>`  
  List open issues in a repository (pagination possible).

- `/repoinfo <repo>`  
  Show detailed information about a repository.

- `/changevisibility <repo> <public|private>`  
  Change the visibility of a repository.

- `/listbranches <repo>`  
  List branches of a repository (pagination possible).

- `/createbranch <repo> <branch> <from_branch>`  
  Create a branch from another branch.

- `/lastcommits <repo> <branch> [n]`  
  Show the last commits of a branch.

- `/setwebhook <repo> <url>`  
  Add a webhook to a repository.

- `/searchrepo <keyword>`  
  Search public repositories on GitHub.

- `/searchmyrepo <keyword>`  
  Search your own repositories.

## Examples

```
/createrepo myproject public
/listrepos
/deleterepo myproject
/addcollab myproject githubuser
/listcollab myproject
/createissue myproject | Critical bug | There is a bug to fix
/listissues myproject
/repoinfo myproject
/changevisibility myproject private
/listbranches myproject
/createbranch myproject dev main
/lastcommits myproject main 5
/setwebhook myproject https://myurl.com/webhook
/searchrepo telegram
/searchmyrepo bot
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_github_username
```

## Requirements

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A GitHub account
- A Telegram account
- A bot created with BotFather on Telegram
- A GitHub personal access token with the necessary permissions
- A `.env` file with your tokens
- A server to run the bot (optional, can be run locally)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Disclaimer

This bot is not affiliated with GitHub or Telegram. Use at your own risk. The author is not responsible for any issues that may arise from using this bot.

## Security

**Never share your `.env` file!**

## Author

This bot was created by [Ltk-Mxz](https://github.com/Ltk-Mxz).

## Contact

For any questions or issues, please open an issue on the GitHub repository or contact [me](mailto:a96.paul96@gmal.com).
