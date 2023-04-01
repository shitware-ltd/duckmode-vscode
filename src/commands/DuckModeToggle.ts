import { Disposable, EventEmitter, Event, commands } from 'vscode';
import State from '../DuckModeState';

export default class DuckModeToggle
{
  public static commandName:string = "duck-mode.toggle";

  private _onDidActivateEmitter: EventEmitter<boolean> = new EventEmitter<boolean>
  public onDidActivate: Event<boolean>;

  constructor(private readonly state: State) {
    this.onDidActivate = this._onDidActivateEmitter.event
  }

  register(): Disposable {

    /** See DuckModeOn.ts for comemnts */
    return commands.registerCommand(DuckModeToggle.commandName, () => {
      this._onDidActivateEmitter.fire(! this.state.duckModeActive);
    })
  }
}
