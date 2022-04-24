

Export only table:----->  mysqldump -u root -p skillspacedb  > tablesBackup.sql
Export only data :----->  mysqldump -u root -p --no-create-info mundoodb > dataBackup.sql
Import only data :----->  mysql -u root -p skillspacedb < dataBackup.sql



