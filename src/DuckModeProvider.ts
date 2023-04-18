import { ConfigurationTarget, Disposable, Event, EventEmitter, workspace,window } from 'vscode';
import DuckModeMia from './commands/DuckModeMia';
import DuckModeOff from './commands/DuckModeOff';
import DuckModeOn from './commands/DuckModeOn';
import DuckModeQuack, { DuckMessage } from './commands/DuckModeQuack';
import DuckModeToggle from './commands/DuckModeToggle';
import State from './DuckModeState';

export default class DuckModeProvider implements Disposable {

  static scheme = "duck-mode";

  private _onDidUpdateStateEmitter: EventEmitter<boolean> = new EventEmitter<boolean>
  private _onDidSendMessageToWebview = new EventEmitter<DuckMessage>();

  private _commands: Disposable[] = [];
  
  private _duckModeOn: DuckModeOn = new DuckModeOn();
  private _duckModeOff: DuckModeOff = new DuckModeOff();
  private _duckModeToggle: DuckModeToggle;
  private _duckModeQuack: DuckModeQuack = new DuckModeQuack();
  private _duckModeMia: DuckModeMia = new DuckModeMia();

  constructor(private readonly state: State) {
    this._duckModeToggle = new DuckModeToggle(state);
  }

  get onDidUpdateState(): Event<boolean> {
    return this._onDidUpdateStateEmitter.event;
  }

  get onDidSendMessageToWebview(): Event<DuckMessage> {
    return this._onDidSendMessageToWebview.event;
  }

  get duckModeOn(): DuckModeOn {
    return this._duckModeOn;
  }

  get duckModeOff(): DuckModeOff {
    return this._duckModeOff;
  }

  get duckModeToggle(): DuckModeToggle {
    return this._duckModeToggle;
  }

  get duckModeQuack(): DuckModeQuack {
    return this._duckModeQuack;
  }

  get duckModeMia(): DuckModeMia{
    return this._duckModeMia;
  }

  registerCommands(): Disposable[] {
    this._commands.push(
      this._duckModeOn.register(),
      this._duckModeOff.register(),
      this._duckModeToggle.register(),
      this._duckModeQuack.register(),
      this._duckModeMia.register()
    );

    return this.registerActivations();
  }

  registerActivations(): Disposable[] {
    return [
      this.duckModeOn.onDidActivate(
        (active) => this._onDidUpdateStateEmitter.fire(active) 
      ),
      this.duckModeOff.onDidActivate(
        (active) => this._onDidUpdateStateEmitter.fire(active) 
      ),
      this.duckModeToggle.onDidActivate(
        (active) => this._onDidUpdateStateEmitter.fire(active) 
      ),
      this.duckModeQuack.onDidActivate(
        (audio: DuckMessage) => {
          
          this._onDidSendMessageToWebview.fire(audio)
        }
      ),
      this.duckModeMia.onDidActivate(
        (audio: DuckMessage) => {
          this._onDidSendMessageToWebview.fire(audio)
        }
      ),
    ];     
  }

  dispose() {
    this._commands.forEach(d => d.dispose());
    this._commands.length = 0;

    this._onDidUpdateStateEmitter.dispose()
    this._onDidSendMessageToWebview.dispose();
  }
}
