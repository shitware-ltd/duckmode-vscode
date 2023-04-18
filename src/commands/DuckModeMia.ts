import { Disposable, EventEmitter, Event, commands, workspace, ConfigurationTarget, extensions } from 'vscode';
import { DuckMessage } from './DuckModeQuack';

export default class DuckModeMia
{
  public static commandName:string = "duck-mode.invoke-mia";

  private _onDidActivateEmitter: EventEmitter<DuckMessage> = new EventEmitter<DuckMessage>
  public onDidActivate: Event<DuckMessage>;

  private originalTheme: string | undefined = '';
  private themes: string[] = [
    'Abyss', 'Red', 'Kimbie Dark', 'Default High Contrast Light','Default High Contrast',
    'Monokai','Quiet Light'
  ];

  constructor() {
    this.onDidActivate = this._onDidActivateEmitter.event
  }

  register() : Disposable {

    this.originalTheme = workspace.getConfiguration('workbench').get('colorTheme');

    /** See DuckModeOn.ts for comments */
    return commands.registerCommand(DuckModeMia.commandName, () => {

      const duckMessage: DuckMessage = {
          type: 'mia',
          domElementId: 'audio-mia'
      }
      this._onDidActivateEmitter.fire(duckMessage);

      let index = -1;

      let thumper = setInterval(() => {
        let newIndex = Math.floor(Math.random() * this.themes.length);
        while(index === newIndex) {
          newIndex = Math.floor(Math.random() * this.themes.length);
        }
        index = newIndex;
        
        this.updateTheme(this.themes[index]);
      }, 437);

      setTimeout(() => {
        clearInterval(thumper);
        this.updateTheme(this.originalTheme);

        const duckMessage: DuckMessage = {
          type: 'mia-stop',
          domElementId: 'none'
        }
        this._onDidActivateEmitter.fire(duckMessage);
      }, 7500)
    })
  }

  private async updateTheme(theme:string|undefined) {
    await workspace.getConfiguration('workbench').update('colorTheme', theme, ConfigurationTarget.Global);
  }
}