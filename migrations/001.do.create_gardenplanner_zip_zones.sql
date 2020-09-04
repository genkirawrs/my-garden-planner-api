CREATE TABLE gp_grow_zones(
    zone TEXT PRIMARY KEY,
    zone_description TEXT DEFAULT NULL,
    zone_first_frost TEXT DEFAULT NULL,
    zone_last_frost TEXT DEFAULT NULL,
    zone_hardiness TEXT NOT NULL
);

CREATE TABLE gp_zipcode_zones(
    zipcode TEXT PRIMARY KEY,
    zone TEXT DEFAULT NULL
	REFERENCES gp_grow_zones(zone) ON DELETE SET DEFAULT
);


