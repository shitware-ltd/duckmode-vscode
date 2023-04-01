import { Disposable, EventEmitter, Event, commands } from 'vscode';

export default class DuckModeOff
{
  public static commandName:string = "duck-mode.duckOff";

  private _onDidActivateEmitter: EventEmitter<boolean> = new EventEmitter<boolean>
  public onDidActivate: Event<boolean>;

  constructor() {
    this.onDidActivate = this._onDidActivateEmitter.event
  }

  register() : Disposable {

    /** See DuckModeOn.ts for comemnts */
    return commands.registerCommand(DuckModeOff.commandName, () => {
      this._onDidActivateEmitter.fire(false);
    })
  }
}
