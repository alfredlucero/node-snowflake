const snowflake = require("snowflake-sdk");

snowflake.configure({
  // ocspFailOpen: false,
  logLevel: "DEBUG",
  // insecureConnect: false,
});

// Create the connection pool instance
// console.log("Process.env for Snowflake test:");
// console.log(process.env);
const connectionPool = snowflake.createPool(
  // connection options
  {
    account: `${process.env.SNOWFLAKE_ACCOUNT_ID}`,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    database: "test_log",
    warehouse: "test_wh",
    role: "ACCOUNTADMIN",
  },
  // pool options
  {
    max: 10, // specifies the maximum number of connections in the pool
    min: 0, // specifies the minimum number of connections in the pool
  }
);

// Use the connection pool and execute a statement
connectionPool.use(async (clientConnection) => {
  await clientConnection.execute({
    sqlText: "select 1;",
    complete: function (err, stmt, rows) {
      var stream = stmt.streamRows();
      stream.on("data", function (row) {
        console.log(row);
      });
      stream.on("end", function (row) {
        console.log("All rows consumed");
      });
    },
  });

  await clientConnection.execute({
    sqlText: "select * from log;",
    complete: function (err, stmt, rows) {
      var stream = stmt.streamRows();
      stream.on("data", function (row) {
        console.log(row);
      });
      stream.on("end", function (row) {
        console.log("All rows consumed");
      });
    },
  });
});
