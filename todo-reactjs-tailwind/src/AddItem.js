import React,{ Component } from 'react';

class AddForm extends Component {
    state = {
        task : ""
    };

    nameRef = React.createRef();
    add = (e) => {
      e.preventDefault();
      let name = this.nameRef.current.value;
      if (name.trim() !== "") {
        this.props.add(name);
        this.nameRef.current.value = "";
      }
    };
    render() {
      return (
        <form onSubmit={this.add} className="flex my-4">
          <input
            type="text"
            ref={this.nameRef}
            className="border border-gray-300 w-full p-2 focus:outline-blue-500"
          />
          <button
            onClick={this.add}
            className="bg-blue-400 py-1 px-4 text-xl text-white ml-2"
          >
            +
          </button>
        </form>
      );
    }
  }
  export default AddForm;
  