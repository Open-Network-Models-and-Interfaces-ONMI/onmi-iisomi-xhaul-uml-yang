/**
  * Represents an event.
  * Events enable a class or object to notify other classes or objects when something of interest occurs.
  * The class that sends (or invokes) the event is called the publisher and the classes that receive (or handle) the event are called subscribers.
  * 
  * Objects can create an instances of an Events and offer that Events for other objects to attach to.
  * Objects who want to be informed about an Event can attach a function (an event handler) to the event which is then called when the event is fired.
  * 
  * @template TEventArg Type of the event argument. Use void if the event does not has an argument.
  */
export class Event<TEventArg> {

  /**
   * Creates a new instance of the Event class.
   */
  constructor() {
    this.eventHandlers = new Array<(arg: TEventArg) => void>();
  }

  /**
   * Adds an event handler to this event, so that when the event is fired the given event handler function is called.
   * 
   * @param eventHandler The event handler function to add to this event.
   * @throws {Error} Thrown if the given event handler function has already been added to this event.
   */
  public addHandler = (eventHandler: (arg: TEventArg) => void): void => {
    if (this.eventHandlers.indexOf(eventHandler) > -1) {
      throw new Error("The given event handler is already added to this event.");
    }

    this.eventHandlers.push(eventHandler);
  }

  /**
   * Removes an event handler from this event, so that the given event handler function will not be called anymore when the event is fired.
   * 
   * @param eventHandler: The event handler function to remove.
   * @throws {Error} Thrown if the given event handler function has not been added to this event before.
   */
  public removeHandler = (eventHandler: (arg: TEventArg) => void): void => {
    const index = this.eventHandlers.indexOf(eventHandler);
    if (!(index > -1)) {
      throw new Error("The given event handler has not been added to this event yet.");
    }

    this.eventHandlers.splice(index, 1);
  }

  /**
   * Invokes the event and calls all event handler functions currently registered on the event.
   * 
   * @param argument The argument for the event. The argument will be passed to all registered event handler functions.
   */
  public invoke = (argument?: TEventArg): void => {
    this.eventHandlers.forEach((eventHandler: (arg?: TEventArg) => void, index: number, array: Array<(arg: TEventArg) => void>): void => {
      eventHandler(argument);
    });
  }

  private eventHandlers: Array<(arg?: TEventArg) => void>;

}
