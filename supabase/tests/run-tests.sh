#!/usr/bin/env bash
# Runs the migrations on a throwaway Postgres database and checks the policies.
# Usage: PGHOST=... PGPORT=... PGUSER=postgres supabase/tests/run-tests.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=quotewell_rls_test
psql -q -d postgres -c "drop database if exists $DB" -c "create database $DB" >/dev/null 2>&1 || true
psql -q -d postgres -c "drop role if exists anon" -c "drop role if exists authenticated" -c "drop role if exists service_role" >/dev/null 2>&1 || true
run() { psql -q -v ON_ERROR_STOP=1 -d $DB "$@"; }
run -f tests/supabase-shim.sql >/dev/null
run -f migrations/20260903091522_init.sql >/dev/null
run -f tests/seed.sql >/dev/null
run -f tests/policies-before.sql
echo
echo '--- After: migrations/20261014090000_harden_leads.sql'
run -f migrations/20261014090000_harden_leads.sql >/dev/null
run -f tests/policies-after.sql 2>&1 | sed -n 's/^.*NOTICE:  //p'
psql -q -d postgres -c "drop database $DB" >/dev/null
