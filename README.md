# Internal nodejs learning course

Application for creating your own lists of movies and series (with ratings, favorite lists and so on), based on using a third party service http://www.omdbapi.com.

# Describtion

Users should enter a title for the movie or series and app by using external API gets content list, which must be saved in local DB (with added own rating, marked it as favorite, etc..).

# How To

Add APP_PORT=[8888] at the beginning or use other ways to set to set environment variable.
Default: APP_PORT=[8787]

Add -- --app_env=[staging] at the end to set env via npm cli
Default: -- --app_env=test

- Run with custom port and env:

  `APP_PORT=8888 npm run dev -- --app_env=staging`

  > Server is running here 👉 http://localhost:8888. Env is staging

- Run with default port and custom env:

  `npm run dev -- --app_env=staging`

  > Server is running here 👉 http://localhost:8787. Env is staging

- Run with default port and env:

  `npm run dev`

  > Server is running here 👉 http://localhost:8787. Env is test

- Run Pure http server written without Express:

  `npm run pure`

  > Pure http Server is running here 👉 http://localhost:8787. Env is test
