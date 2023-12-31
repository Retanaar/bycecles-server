//db.auth("bycecles_admin", "bycecles_password");

//

db.createUser({
  user: "bycecles_admin",
  pwd: "bycecles_password",
  roles: [
    {
      role: "readWrite",
      db: "test",
    },
  ],
});

db("test").createCollection("bycecles");
