import { Disposable, EventEmitter, Event, commands } from 'vscode';

export default class DuckModeOn
{
  public static commandName:string = "duck-mode.duckOn";

  private _onDidActivateEmitter: EventEmitter<boolean> = new EventEmitter<boolean>
  public onDidActivate: Event<boolean>;

  constructor() {
    this.onDidActivate = this._onDidActivateEmitter.event
  }

  register() : Disposable {

    /**
     * This registers commands with VS Code that will be called when certain
     * actions are taken in the IDE itself, such as button or menu item clicks
     * 
     * This then executes functionality in our extension, when we have our own event
     * emitters to communicate within the extension
     */
    return commands.registerCommand(DuckModeOn.commandName, () => { 
      this._onDidActivateEmitter.fire(true);
    })
  }
}
