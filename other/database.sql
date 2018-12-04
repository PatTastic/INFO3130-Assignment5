CREATE TABLE geoPoint
(
    id              INTEGER         AUTO_INCREMENT  UNIQUE,
    lat             REAL            NOT NULL,
    lng             REAL            NOT NULL,
    address         TEXT,
    ts              INTEGER         NOT NULL,
    weight          INTEGER         NOT NULL,
    CONSTRAINT pk_geoPoint PRIMARY KEY (id)
);

CREATE TABLE analytics
(
    id              INTEGER         AUTO_INCREMENT  UNIQUE,
    type            TEXT            NOT NULL,
    averageCost     REAL,
    averageRating   REAL,
    CONSTRAINT pk_analytics PRIMARY KEY (id)
);
