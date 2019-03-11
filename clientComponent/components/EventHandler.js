class EventHandler {
  constructor() {
    this.listeners = new Set;
  }

  listen(type, callback) {
    this.listeners.add({
      type,
      callback
    })
  }

  emit(type, ...args) {
    this.listeners.forEach(listener => {
      // purpose of this line is important
      //it goes throuhg all the listeners and takes out the requested on, only if it exists
      if(listener.type === type) {
        //emits passed arguments
        listener.callback(...args)
      }
    })
  }
}