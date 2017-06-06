# Buildinfo

Ausgehend vom Verzeichnis:
SDN-Projects-Boron/code/ux

ll => pom.xml muss vorhanden sein.

## manuelles Builden

Die Schritte 1, 5 und 6 sind während des Buildens notwendig, die anderen Schritte sind zu Kontrollzwecken und zum starten / Stoppen vom Karaf Server

1. Für den Compilevorgang der eigenen Komponenten:
  - `cd ~/SDN-Projects-Boron/code`
  - `mvn clean install -DskipTests`
  - `cp -R ~/.m2/repository/com/highstreet $ODL_KARAF_HOME/system/com`
2. Zum beenden von Karaf:
  - ctrl+d in der Shell, auf der Karaf läuft.
  - `sudo $ODL_KARAF_HOME/bin/client -u karaf "shutdown --force"`, wenn man nicht in der passenden Shell ist
3. Starten von Karaf:
  - `cd $ODL_KARAF_HOME`
  - `./bin/karaf`
4. Zum gucken, welche Module installiert sind (von highstreet, grep):
  - `bundle:list | grep mwtn`
5. Bundles deinstallieren (Funktioniert nur innerhalb der Karaf Shell)
  - `bundle:uninstall "ONF :: Wireless :: mwtnCommons-bundle" "ONF :: Wireless :: mwtnTopology-bundle"`
6. (geänderte) Bundles installieren (Funktioniert nur innerhalb der Karaf Shell)
  - `bundle:install -s mvn:com.highstreet.technologies.odl.dlux/mwtnCommons-bundle/0.4.0-SNAPSHOT mvn:com.highstreet.technologies.odl.dlux/mwtnTopology-bundle/0.4.0-SNAPSHOT`

## GIT:

Abrufen:
- `cd ~/SDN-Projects-Boron/code/ux/mwtnTopology/mwtnTopology-module/src/main/resources`
- `git pull`

Einchecken:
- `git add doc/*.md`
- `git status` (Kontrolle der einzucheckenden Dateien)
- `git commit` (Ist der eincheckvorgang an sich (lokaler GitServer))
- `git push` (Übertragen aller Commits zum zentralen Server)
