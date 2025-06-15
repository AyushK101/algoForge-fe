data "external_schema" "prisma" {
  program = [ 
    "npx",
    "prisma",
    "migrate",
    "diff",
    "--from-empty",
    "--to-schema-datamodel",
    "prisma/schema.prisma",
    "--script"
  ]
}

env "local" {
  src = data.external_schema.prisma.url
  dev = "postgresql://postgres:secret@localhost:5432/atlas_temp?sslmode=disable"
}