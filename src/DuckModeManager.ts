
import { commands, Disposable, StatusBarAlignment, StatusBarItem, Uri, window } from 'vscode';
import DuckModeToggle from './commands/DuckModeToggle'
import Cursors from './ducklibs/Cursors';
import QuackOnSave from './ducklibs/Quack';
import DuckModeProvider from './DuckModeProvider';
import State from './DuckModeState';
import SpeciesViewProvider from './SpeciesViewProvider';

export default class DuckModeManager
{
  public state: State = {
    extensionActive: false,
    duckModeActive : false
  }

  private _duckModeProvider: DuckModeProvider;
  private _speciesViewProvider: SpeciesViewProvider;
  private _statusBarItem: StatusBarItem;
  private _listeners: Disposable[] = [];
  private _cursors : Cursors = new Cursors();
  private _quackOnSave : QuackOnSave = new QuackOnSave();

  public constructor(extensionUri: Uri) {
    this._duckModeProvider = new DuckModeProvider(this.state);
    this._speciesViewProvider = SpeciesViewProvider.factory(extensionUri)

    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 1);
  }

  public activate(): void {

    this._listeners.push(
      ...this._duckModeProvider.registerCommands(),
      this._speciesViewProvider.registerWebview(),
      this._quackOnSave.register(),
      ...this._cursors.register()
    );

    this._duckModeProvider.onDidUpdateState((active) => this.updateState(active));
    this._duckModeProvider.onDidSendMessageToWebview((message) => this._speciesViewProvider.sendMessage(message));
    this.state.extensionActive = true;

    this._statusBarItem.command = DuckModeToggle.commandName;
    this.updateStatusBar();
    this._statusBarItem.show();
  }

  public deactivate(): void {
    this._listeners.forEach(l => l.dispose());
    this._listeners.length = 0;

    this._statusBarItem.dispose();
    this.state.duckModeActive = false;
    this.state.extensionActive = false;
  }

  public get isExtensionActive(): boolean {
    return this.state.extensionActive;
  }

  private updateState(activeState: boolean) {
    this.state.duckModeActive = activeState;

    this.setActivationContext();
    this.updateStatusBar();
    this.showActivationNotification();
  }

  private setActivationContext(): void {
    commands.executeCommand('setContext', DuckModeProvider.scheme + '.duckModeActive', this.state.duckModeActive);
  }

  private updateStatusBar(): void {
    const modeText = this.state.duckModeActive ? "On" : "Off";

    this._statusBarItem.text = `Duck Mode ${modeText} $(pd-duck)`;
    //if (duckCursor) {
    //    duckCursor.toggleDecorations(duckModeOn);
    //}
  }

    private showActivationNotification(): void {
      const message = 'Duck mode ' +
        (this.state.duckModeActive ? '' : 'de') +
        'activated!';

      window.showInformationMessage(message);
   }
}
