import { IonApp, setupIonicReact } from "@ionic/react";
import { IonRouterOutlet } from "@ionic/react";
import { useEffect } from "react";
import { IonReactRouter } from "@ionic/react-router";
/* prevent overlap android */
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

import AppRoute from "./AppRoute";

setupIonicReact();

const App: React.FC = () => {

  useEffect(() => {
    // Check if the app is running on a native platform (iOS/Android)
    if (Capacitor.isNativePlatform()) {
      // Set the webview NOT to overlap the status bar area.
      // This is the core fix for the Android header overlap issue.
      StatusBar.setOverlaysWebView({ overlay: false });
    }
  }, []);
  
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {AppRoute()}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
