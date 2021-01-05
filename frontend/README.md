# Cluster table exercise

This exercise contains a simple React frontend app written in TypeScript that says "Hi!" (in the `frontend/` directory), and a simple Python server (in the `backend/` directory).

A GET request to the root of the python server returns a JSON response that has two properties: _clusters_ and _tasks_ (I'll let you look at the code or run the server to see the exact shape). Note crucially that the "cluster_id" property on a _task_ refers to the "id" of a _cluster_.

We would like you to edit the frontend so that instead of saying "Hi!" it shows a button, which when clicked will call the server and munge the response in order to display a "Clusters" table like the one below:


| ID | Name         | Owner | Num Running Tasks | Num Stopped Tasks |
|----|--------------|-------|-------------------|-------------------|
| 1  | good-cluster | casey | 1                 | 0                 |

(Note that ID and Name in the above table refer to the id and name of the _cluster_ objects.)

You don't have to worry about CSS or making it look nice, and you can organize your code in the frontend how you see fit. You don't need to edit the backend code for this exercise.

## Getting up and running

### Backend

#### Install

This was built with Python 3.8, though Python 3.7 should work fine.

`cd` into the `backend` folder. In a virtual environment, install the dependencies found in `requirements.txt`.

For example, here are steps using `conda` (via the [MiniConda](https://docs.conda.io/en/latest/miniconda.html) installation) to create an environment and `pip` to install the dependencies. You don't have to use conda, just figured I'd be thorough.

```shell
conda create -n cluster-table python=3.8
conda activate cluster-table
pip install -r requirements.txt
```

#### Run

In the `backend` folder, run `uvicorn main:app`. You should be able to navigate to `http://localhost:8000` and see the clusters response in a browser.

### Frontend

#### Install

This was built using `yarn`, but `npm` should work too. These instructions use yarn:

`cd` into the `frontend` folder. Run `yarn` to install dependencies.

#### Run

There are some helper commands in the `package.json::scripts`:

- `yarn start`: starts a development server that should hot reload as you make changes. Note that the TypeScript compilation here is very forgiving (it will still build on TypeScript errors).
- `yarn start-strict`: This will run `tsc` before starting, and TypeScript will complain before running.
