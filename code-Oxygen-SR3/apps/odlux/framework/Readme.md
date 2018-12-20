## Erste Schritte
### Einrichtung der Arbeitsumgebung unter Linux
1. NodeJS LTS installieren: [https://nodejs.org/en/](https://nodejs.org/en/) 
2. Yarn installieren: `sudo npm install -g yarn`
3. Lerna installieren: `sudo yarn global add lerna`
4. Arbeitsverzeichnis erstellen z.B. `~/work`
5. In das Arbeitsverzeichnis wechseln cd `~/work`
6. Repository klonen: `git clone https://adresse.des/reposerory`
7. in der Verzeichnis `cd odlux` wechseln
8. Lerna initialisieren npm parakete laden: `lerna bootstrap`
 
### Einrichtung der Arbeitsumgebung unter Windows
1. NodeJS LTS installieren: [https://nodejs.org/en/](https://nodejs.org/en/) 
2. Yarn installieren: `npm install -g yarn`
3. Lerna installieren: `yarn global add lerna`
4. Arbeitsverzeichnis erstellen z.B. `c:\work`
5. In das Arbeitsverzeichnis wechseln cd `c:\work`
6. Repository klonen: `git clone https://git-highstreet-technologies.com/highstreet/odlux.git`
7. in der Verzeichnis `cd odlux` wechseln
8. Lerna initialisieren npm parakete laden: `lerna bootstrap`

### Anpassen an die Lokale Umgebung
1. In das Framework Verzeichnis wechseln: `cd framework`
2. Datei `webpack.config.js` bearbeiten
3. Eintrag `devServer: { /* ... */ }` suchen
4. Abschitt `proxy` suchen
5. Alle Pfade, die von dem ODL-Backend verwendet werden sollen hinzufügen. Beispiel, wenn der Pfad `/api` auf  `http://localhost:3001/api` zeigen soll ist folgen der Eintrag hinzuzufügen, wobei `http://localhost:3001` die Addresse des ODL Backends auf dem Computer ist:
   ```json
     devServer: {
       // ...
       proxy: {
         "/api": {
            target: "http://localhost:3001/api",
            secure: false
         }
       }
    }
   ```
6. Diese Schritte sind für **ALLE** Anwendungen (App) im `apps`-Verzeichnis ebenfalls zu wiederholen.

### Framework OHNE Anwendung starten
1. In das Framework Verzeichnis wechseln: `cd framework`
2. Project erstellen: `yarn run build` für Release oder `yarn run build:dev` für Entwicklungsversion
3. Projekt sarten: `yarn start`
4. Webbbrowser öffnen: `http://localhost:3100/

H> **Hinweis:** Der Port kann in der Datei `webpack.config.js` im Abschitt `devServer` unter `public` ggf. angepaßt werden.

### Anwendung einzeln starten
1. Einmal das Framework erstellen (siehe vorheriger Abschitt)
2. In das Verzeichnis der Anwendung wechseln: z.B. `cd apps/demoApp`
3. Optional: Project erstellen: `yarn run build` für die Erstellung einer Release.
4. Projekt sarten: `yarn start`
5. Webbbrowser öffnen: `http://localhost:3100/

H> **Hinweis:** Der Port kann in der Datei `webpack.config.js` im Abschitt `devServer` unter `public` ggf. angepaßt werden.

T> **Profitip**: In der Datei `index.html` befindet sich der Aufruf zum laden der einzelnen Apps. Hier könnnen weitere Apps hinzugefügt werden. Dazu ist es allerdings erforderlich entsprechende Proxy Regeln für den Webpack-Dev-Server mit den jeweiligen Pfaden zu erstellen, so dass die Module gefunden werden können. 

## Eigene Anwendung erstellen
### Kopieren der Schablone
Zur Zeit gibt es noch keine automatisierte Schablone oder Maven Artefakt Vorlage, die automatisch eine neue Anwendung erstellt. Aus diesem Grund ist der einfachste Weg, die Muster App `demoApp` unter  `apps` zu kopieren. 

Anschließend sind die folgenden Anpassungen vorzunehmen.

1. Mindestens **Name**, **Version** und **Beschreibung** in der Datei `packages.json` anpassen : `"name": "@odlux/demo-app",` 
   H> Hinweis: Anstelle von Großbuchstaben nur Bindestrich Buchstabe verwenden. demoApp wird zu demo-app.
2. Datei `webpack.config.js` prüfen ob alle Backend Pfade koniguriert sind (siehe Anpassen der lokalen Umgebung)
3. Name des Modules in der Webpack-Config anpassen (demoApp). Dieser wird gefolgt von dem Pfad zu der Einstiegsdatei (`./plugin.tsx`).
   ```js
     entry: {
       demoApp: ["./plugin.tsx"]
     },
   ```
   H> Hinweis: Keine Bindesriche oder Sonderzeichen verwenden. 
4. Optional kann in dem gleichen Eintrag festgelegt werden wie die Einstiegsdatei für dieses Module / diese App heißen soll. Default ist `plugin.tsx`.
5. In der Datei `index.html` ist das zu ladende Module (`demoApp`) auszutauschen, gegen das eigene Modul:
   ```js
    // run the application
    require(["app","demoApp"], function (app) {
      app("./app.tsx")
    });
   ``` 
   H> Hinweis: Der Name dieses Modules wurde in Schritt 3. festgelgt.

### Anpassen der Konfiguration der App
Die Konfiguration der neuen App erfolgt innerhalb der Einstiegsdatei(default: `plugin.tsx`). Hier wird der eindeutige Name, das Icon, der Titel der Menueintrag usw. festgelegt.

1. Icon aus der Bibliothek `fontawsome 5` auswählen.
   ```ts
     import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
   ```

2. Anpassen der Registration der App in der Einstiegsdatei.    
Der eindeutige Name wird vom Framework verwendet, um die Apps voneinander zu unterscheiden. Das Icon wird für die Navigation und die Title-Leiste genutzt. Die Root-Komponente ist die äußrste Komponente dieser App. Der Menu-Eintrag ist optional um einen Namen für dieser App in der Navigation darzustellen.
   ```js
    applicationManager.registerApplication({ 
      name: "demoApp",         // eindeutiger Name der App
      icon: faAddressBook,     // Icon der App 
      rootComponent: FinalApp, // Wurzelkomponente der App
      menuEntry: "Demo App"    // Menu Eintrag 
    });
   ```

3. Wenn diese Application einen eigenen Action-Handler enthällt, so ist dieser ebenfalls zu konfigurieren. Die Erstellung von Action Handlern wird ein einem Seperatem Abschitt genauer betrachtet.
   ```js
    applicationManager.registerApplication({ 
      // ...
      rootActionHandler: demoAppRootHandler,
    });
   ```

4. Wenn diese Application eigene Komponenten für andere Apps bereit stellen soll, so sind diese auch zu konfigurieren. Dabei ist der Schlüssel der Name mit dem später auf die Komponete zugegriffen werden kann, sowie der Wert die zu exportierende Komponente.
   ```js
    applicationManager.registerApplication({ 
      // ...
      exportedComponents: { counter: Counter },
    });
   ```

5. Optional kann ein Pfad angegeben werden unter dem die App ereicht werden soll. Wird dieser nicht festgelegt wird der Name als Pfad genutzt. 
   ```js
    applicationManager.registerApplication({ 
      // ...
      path: "demoApp",
    });
   ```

Hier können z.B. URL-Parameter spezififiert werden, die der App übergeben werden sollen.          
   ```js
    applicationManager.registerApplication({ 
      // ...
      path: "demoApp/:param1",
    });
   ```

6. Abhänig davon ob die App einen oder mehrere URL Prameter bekommen soll sind diese als generische TypeParameter für die `RouteComponentProps` der `AppProps` mit anzugeben.
  ```ts
    // Beispiel ohne Parameter
    type AppProps = RouteComponentProps & Connect;

    // Beispiel mit einem Parameter
    type AppProps = RouteComponentProps<{ param1: number }> & Connect;
  ``` 

  7. Wenn Sub-Routen innerhalb der App verwendet werden sollen, sind diese innerhalb der Root-Komponente anzugeben. Sonst kann direkt mit der Programmierung der Hauptansicht begonnne werden. 
  ```ts
    const App = (props: AppProps) => (
      <Switch>
        <Route exact path={ `${ props.match.path }/authors` } 
               component={AuthorsList} /> 
        <Route path={ `${ props.match.path }/authors/:authorId` } 
               component={EditAuthor } /> 
        <Redirect to={ `${ props.match.path }/authors` } />
       </Switch>
    ); 
  ```
8. In jedem Fall ist die App unter Verwendung von `withRouter` mit dem Router zu verbinden.
  ```ts
    const FinalApp = withRouter(connect()(App)); 
  ```

### Erstellen der Datenmodelle bzw Dienste 
Alle Datenmodelle, die innerhalb dieser App verwendet werden sollen werden innerhalb des Ordners `models` bzw. in einem Unterordner in diesem Ordner erstellt. Beispiel: `Author` für die Darstellen von Autoren.
   ```ts
    /**
     * Represents an author.
     */
    export interface IAuthor {
      /**
       * Defines the unique id of the autor. 
       */
      id: number;
    
      /**
       * Defines the first name of this author.
       */
      firstName: string;
    
      /**
       * Defines the last name of this author.
       */
      lastName: string;
    }
   ```

Alle Dienste die diese App verwenden soll liegen in dem Ordner `services` oder einem darin befindlichem Unterordner. In der Aktuellen Version werden Dienste als **Singleton** erstellt. Dazu exportiert die Datei mit der Implementierung eine einzelne Instanz als `default`.
   ```ts   
    class AuthorService {
      // ...
    }
    // return as a singleton
    export const authorService = new AuthorService();
    export default authorService;
   ```

### Erstellen / Anpassen eigener Action-Handler
Jede Application kann einen `Root-State` definieren, der alle Zustände speziell für diese App repräsentiert. Dieser sollte als Schnittstelle definiert werden mit dem Namen der sich aus I**AppName**StoreState zusammensetzt. Für die `demoApp` würde dieser also `IDemoAppStoreState` heißen.
   ```ts
    export interface IDemoAppStoreState {
      listAuthors: IListAuthors;
      editAuthor: IEditAuthor;
    }
   ```

Es bietet sich an, diesesn **StoreState** innerhalb der Datei mit dem `Root-Action-Handler` zu erstellen. Der Name sieser Datei sollte aich wie folgt zusammen setzen **appName**RootHandler.ts im Verzeichnis `handlers`. Für die `demoApp` wäre das `demoAppRootHandler.ts`.

Um mit der Typesicherheit von TypeScript auf den Gesamt-Anwendugs-Zustand korreckt zugreifen zu können, ist es erforderlich diesen innerhalb dieser Datei, um den Anwendungszustand der App wie folgt zu erweitern.
   ```ts
     declare module '../../../../framework/src/store/applicationStore' {
       interface IApplicationStoreState {
         demoApp: IDemoAppStoreState
       }
     }
   ```

Sollte sich der Zusatand der App aus mehreren ActionHandlern zusammensetzen, so sind diese vor dem exportieren zu verbinden mit der Funktion `combineActionHandler` des Frameworks.
   ```ts
    const actionHandlers = {
      listAuthors: listAuthorsHandler,
      editAuthor: editAuthorHandler,
    };
     
    export const demoAppRootHandler = combineActionHandler <IDemoAppStoreState>(actionHandlers);
    export default demoAppRootHandler;
   ```

## Bibliotheken
Das O-D-L-UX Framework unterscheidt in Bibliotheken, die nur einer einzelnen App zugeordnet werden. Diese können nicht mit anderen Apps geteilt werden und müssen in jeder App seperat installiert werden. Was zur Folge hat, dass diese auch in dem Bundle jeder App enthalten sind.

Sowie Bibliotheken, die zwischen alle Apps geteilt werden. Diese müssen nicht in jeder App installiert werden und sind auch nur einmal in dem Bundle des Frameworks vorhanden.

### Hinzufügen einer geteilte Bibliothek
Beispiele für geteilte Bibliotheken sind `react`, `react-dom`, `jQuery` oder `lodash`. Diese Bibliothek wird zunächst den Abhägnigkeiten der übergeordneten `package.json` Datei (im Root-Verzeichnis von O-D-L-UX) im Abschnitt `dependencies` hinzugefügt. 
   ```json
    "dependencies": {
      "@types/react": "16.4.14",
      "@types/react-dom": "16.0.8",
      "@types/react-router-dom": "4.3.1",
      "@material-ui/core": "3.1.1",
      "@material-ui/icons": "3.0.1",
      "@types/classnames": "2.2.6",
      "@types/flux": "3.1.8",
      "@types/jquery": "3.3.10",
      "jquery": "3.3.1",
      "react": "16.5.2",
      "react-dom": "16.5.2",
      "react-router-dom": "4.3.1",
      "@fortawesome/react-fontawesome": "0.1.3",
      "@fortawesome/fontawesome-svg-core": "1.2.4",
      "@fortawesome/free-solid-svg-icons": "5.3.1",
      "jsonwebtoken": "8.3.0",
      "@types/jsonwebtoken": "7.2.8"
    },
   ```

Anschließend werden die Abhägigkeiten, die jeweils für das Framework und/oder die App erforderlich sind in die `package.json` Datei des Frameworks bzw. der App in den Abschitt `peerDependencies` übernommen, die jeweils von den geteilten Abhänigkeiten erforderlich sind.
   ```json
    "peerDependencies": {
      "@types/react": "16.4.14",
      "@types/react-dom": "16.0.8",
      "@types/react-router-dom": "4.3.1",
      "@material-ui/core": "3.1.1",
      "@material-ui/icons": "3.0.1",
      "@types/classnames": "2.2.6",
      "@types/flux": "3.1.8",
      "@types/jquery": "3.3.10",
      "jquery": "3.3.1",
      "react": "16.5.2",
      "react-dom": "16.5.2",
      "react-router-dom": "4.3.1"
    }
   ```

Nachdem **ALLE** erforderlichen Apps und das Framework mit der neuen Abhägnigkeit konfiguiert wurden wird der Befehl: `lerna bootstrap` ausgeführt, um die Abhägigkeiten herunter zu laden und bereit zu stellen für die Apps sowie das Framework.

### Hinzufügen einer exclusiven Bibliothek
Wenn eine App eine Bibiotjek verwenden solle, diese aber nicht mit den anderen Apps teilen soll, so ist diese Abhägigkeit nur in die `package.json` Datei des App in dem Abschnitt `dependencies`einzufügen. 
   ```json
     "dependencies": {
       "object-assign": "3.2.1"
     }
   ```

Auch in diesem Fall ist `lerna bootstrap` im Root-Verzeichnis von O-D-L-UX auszuführen.

## Eigene Bibliothklen 
Eigene Bibliotheken können in einem jeweils in einem seperatem Projekt-Ordner unterhalb des `lib` Ordners entwickelt werden.
