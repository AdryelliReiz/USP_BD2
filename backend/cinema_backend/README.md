# Cinema Project backend

## WSL2

if you are on windows, you can install Windows Subsystem for Linux 2 (WSL2) by running the following on CMD as Administrator:

```bat
wsl --install
```

To ensure everything is up to date, run the following commands:

```bash
sudo apt update
sudo apt upgrade
sudo apt install curl wget git sudo python3-pip
```

Also install Github CLI by running the following command:

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
	&& sudo mkdir -p -m 755 /etc/apt/keyrings \
	&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
	&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
	&& sudo apt update \
	&& sudo apt install gh -y
```

and authenticate with your github account by running the following command:

```bash
git config --global user.email "<your-github-mail>"
git config --global user.name "<your-github-username>"
gh auth login
```

## Run Locally

### Docker

if you don't have docker installed, you can install it by running the following command:

```bash
curl -fsL https://get.docker.com | sudo sh
```

### Running

Clone the project:

```bash
git clone https://github.com/AdryelliReiz/USP_BD1.git
```

Go to the project directory:

```bash
cd USP_BD1/backend/cinema_backend
```

Install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a Database using docker:

```bash
docker run --name cinema_postgres -e POSTGRES_DB=cinemaDB -e POSTGRES_USER=cinemaUser -e POSTGRES_PASSWORD='Cinema@Senha007' -d -p 5432:5432 postgres:alpine
```

Start the server

To start the server you need to run the migrations for the first time.

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

## Stopping the server

To stop the server, you can press `Ctrl + C` on the terminal.
To stop the Database, you can run the following command:

```bash
docker stop cinema_postgres
```

And if you want to remove the database:

```bash
docker rm cinema_postgres
```

IF you are using WSL2, you can shutdown VM by running the command on every terminal:

```bash
wsl.exe --shutdown
```
