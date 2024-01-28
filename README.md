# todo-app-api

## A simple API to handle a todo-like app.
### Developed with Laravel 10

## Local Setup
### We will use Homestead to setup the project on our local environment.
### Required 
1. [php](https://www.php.net/downloads.php)
2. [Composer](https://getcomposer.org/download/)
3. [Oracle VirtualBox](https://www.virtualbox.org/wiki/Downloads)
4. [Vagrant](https://www.vagrantup.com/downloads)

### Setup
1. Run `git clone https://github.com/laravel/homestead.git ~/Homestead` to clone Homestead
2. Redirect to the Homestead directory by running `cd ~/Homestead`
3. Checkout to the release branch `git checkout release`
4. Run the following command to create the **Homestead.yaml** file
```
# macOS / Linux...
bash init.sh
 
# Windows...
init.bat
```
5. Add the following to the Homestead.yaml file
```
folders:

    - map: /path/to/the/app/todo-app-api
      to: /home/vagrant/todo-app-api

    - map: ~/code
      to: /home/vagrant/code

sites:

    - map: todo-app-api.com
      to: /home/vagrant/todo-app-api/public

    - map: homestead.test
      to: /home/vagrant/code/public
```
6. Next, run a text editor as administrator and update the **hosts** file
```
192.168.56.56  todo-app-api.com
```
7. Run `vagrant up` to initiate Homestead. This will take a while because it will download the Homestead box for your virtual machine.
8. After Homestead is initiated, run `vagrant ssh` to SSH into the newly created VM.
9. Redirect to the project by typing `cd /home/vagrant/todo-app-api.com`
10. Run `composer install` to install the composer packages needed.
11. Generate an **APP_KEY** by executing the command `php artisan key:generate`.
12. An **.env** file should be created for you, inside it, change the key-value pairs for database setup.
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todo-app
DB_USERNAME=homestead
DB_PASSWORD=secret
```
13. Create the database by typing `mysql` then `CREATE DATABASE 'todo-app';`.
14. Run `php artisan migrate:fresh` to create the tables.

### And done! You should now be able to call the API on your local machine.

## Tables
### The API uses 2 tables, `todo` and `user`. 
### `todo`
| Column | Type | Required on create | Required on update | Description |
| --- | --- | --- | --- | --- |
| id | int | N | Y | Primary key. |
| label | varchar | Y | N | Label of the task. |
| description | varchar | N | N | Short description about the task. |
| duration | int | N | N | Estimated duration of the task in minutes. |
| user_id | int | Y | N | Foreign key referencing a user in the `user` table. |
| next_id | int | N | N | Foreign key referencing another task in the `todo` table. Points to the next task. If `next_id` is null, that means that task is the tail task. |
| created_at | datetime | N | N | Datetime when the task was created. |
| updated_at | datetime | N | N | Datetime when the task was last updated. |
### `user`
We can't interact with the table with the API. We have to manually insert users into the database to create our users.
| Column | Description |
| --- | --- |
| id | Primary key. |
| name | Name. |
| username | Username. |
| password | Password. |
| root_task_id | Task if of the user's first task. |
| created_at | Datetime when the user was created. |
| updated_at | Datetime when the user was last updated. |

## How to use
Assuming all steps above has been followed properly, we can call the API using the endpoint `http://todo-app-api.com/api/todo`.
<br>Here is a list of methods and endpoints supported by this API:
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | http://todo-app-api.com/api/todo | List all the tasks in the todo list in order. Add `user_id` key in the request to only get tasks from a specific user. |
| POST | http://todo-app-api.com/api/todo | Insert a new task. |
| PUT | http://todo-app-api.com/api/todo/{id} | Update a specific task. |
| DELETE | http://todo-app-api.com/api/todo{id} | Delete a specific task. |
| PUT | http://todo-app-api.com/api/todo/reorder/{id} | Reorder the task and move it to a different position. Make sure to add the `prev_id` key to move the task after the `prev` task. Not setting the `prev_id` value will move the task to the root (first task position). |

### Examples
| Method | Sample endpoint | Request | Action |
| --- | --- | --- | --- |
| GET | http://todo-app-api.com/api/todo | | Retrieves ALL tasks in order. |
| GET | http://todo-app-api.com/api/todo | user_id : 1 | Retrieves tasks of user with id of 1 in order. |
| POST | http://todo-app-api.com/api/todo | user_id : 1<br>label : Task 1<br>description : Task 1 description. | Creates a task for user with id of 1 with the given label and description. |
| POST | http://todo-app-api.com/api/todo | user_id : 1<br>description : Task 2 description. | Returns an error since `label` is not provided. |
| PUT | http://todo-app-api.com/api/todo/1 | description : Task 3 updated. | Updates the task with id of 1 with the given description. |
| DELETE | http://todo-app-api.com/api/todo/1 | | Deletes the task with id of 1. |
| PUT | http://todo-app-api.com/api/todo/reorder/3 | prev_id : 1 | Moves the task with id of 3 after task with id of 1. |
| PUT | http://todo-app-api.com/api/todo/3 | | Moves the task with id of 3 to the first position. |