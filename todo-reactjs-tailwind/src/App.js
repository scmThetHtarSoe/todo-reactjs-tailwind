import "./App.css";
import React, { Component } from "react";
import AddForm from "./AddItem";

class App extends Component {
  state = {
    items:
      JSON.parse(localStorage.getItem("todos")) == null
        ? []
        : JSON.parse(localStorage.getItem("todos")),
    filter: "all",
    filteredItems: [],
    leftItemCount: 0,
    isEditing: false,
    editId: null,
    editName: null,
    oldEditName: null
  };

  updateLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.state.items));
  }

  add = (name) => {
    this.setState(
      {
        items: [...this.state.items, { id: Date.now(), name, done: false }],
      },
      () => {
        this.updateLocalStorage();
      }
    );
  };

  filteritems = (condition) => {
    switch (condition) {
      case "all":
        this.setState({ filter: "all", filteredItems: this.state.items });
        break;
      case "active":
        this.setState({
          filter: "active",
          filteredItems: this.state.items.filter((item) => item.done === false),
        });
        break;
      case "completed":
        this.setState({
          filter: "completed",
          filteredItems: this.state.items.filter((item) => item.done === true),
        });
        break;
      default:
        this.setState({ filter: "all", filteredItems: this.state.items });
        break;
    }
  };

  renderItems() {
    const itemsToRender =
      this.state.filter === "all" ? this.state.items : this.state.filteredItems;
    this.leftItemCount = this.state.items.filter(
      (item) => item.done !== true
    ).length;
    return itemsToRender.map((item) => (
      <li
        key={item.id}
        className="bg-gray-200 text-black py-2.5 px-5 border-b-2 border-neutral-100 flex items-center mb-1"
      >
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => this.toggleCompletedItem(item.id)}
        />
        {this.state.isEditing && this.state.editId === item.id ? (
          <input
            type="text"
            className="w-[300px] p-2.5 border-1 border-neutral-100"
            value={this.state.editName === null ? "" : this.state.editName}
            onChange={(e) => this.handleChange(e)}
            onBlur={this.handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                this.handleBlur();
              }
            }}
            autoFocus
           />
        ) : (
          <span
            onDoubleClick={() => this.handleDoubleClick(item.id)}
            className={item.done ? "line-through ml-4" : "ml-4"}
          >
            {item.name}
          </span>
        )}

        <button
          onClick={() => this.deleteItem(item.id)}
          className="text-xl text-red-600 bg-white py-1 px-2 ml-auto"
        >
          &times;
        </button>
      </li>
    ));
  }

  deleteItem = (id) => {
    const items = [...this.state.items];
    const index = items.findIndex((item) => item.id === id);
    items.splice(index, 1);
    this.setState({ items }, () => {
      this.updateLocalStorage();
    });
  };

  toggleCompletedItem = (id) => {
    const items = [...this.state.items];
    const index = items.findIndex((item) => item.id === id);
    const toggleItem = items[index];
    toggleItem.done = toggleItem.done === true ? false : true;
    this.setState({ items }, () => {
      this.updateLocalStorage();
    });
  };

  handleDoubleClick = (id) => {
    const items = [...this.state.items];
    const getIndex = items.findIndex((item)=>item.id === id);
    const getEditName = items[getIndex].name;
    this.setState({ isEditing: true, editId: id, editName: getEditName ,oldEditName:getEditName});
  };

  handleBlur = () => {
    const items = [...this.state.items];
    const editedItemIndex = items.findIndex(
      (item) => item.id === this.state.editId
    );
    const getOldEditName = items[editedItemIndex].name;
    this.setState({ isEditing: false ,oldEditName:getOldEditName});
  };

  handleChange = (e) => {
    const newEditName = e.target.value;
    const items = [...this.state.items];
    const editedItemIndex = items.findIndex(
      (item) => item.id === this.state.editId
    );
    if (newEditName.trim() !== "") {
      items[editedItemIndex].name = newEditName;
    } else {
      items[editedItemIndex].name = this.state.oldEditName;
    }

    this.setState({ editName: newEditName, items }, () => {
      this.updateLocalStorage();
    });
  };

  checkAll(e) {
    const items = [...this.state.items];
    const getButtonText = e.target.textContent;
    if (getButtonText === "Check All") {
      items.map((item) => {
        return (item.done = true);
      });
      this.setState({ items }, () => {
        this.updateLocalStorage();
      });
    } else {
      items.map((item) => {
        return (item.done = false);
      });
      this.setState({ items }, () => {
        this.updateLocalStorage();
      });
    }
  }

  clearCompleted() {
    const items = this.state.items.filter((item) => item.done !== true);
    this.setState({ items }, () => {
      this.updateLocalStorage();
    });
  }

  render() {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="container shadow w-[800px] h-auto p-8">
          <h1 className="title text-3xl">To Do</h1>
          <AddForm add={this.add} />
          <div className="flex">
            <button
              onClick={() => this.filteritems("all")}
              className="flex-1 border border-gray-200 px-12 py-2 hover:bg-blue-400 hover:text-white"
            >
              Show All
            </button>
            <button
              onClick={() => this.filteritems("active")}
              className="flex-1 border border-gray-200 py-2 px-12 hover:bg-blue-400 hover:text-white"
            >
              Show Active
            </button>
            <button
              onClick={() => this.filteritems("completed")}
              className="flex-1 border border-gray-200 py-2 px-12 hover:bg-blue-400 hover:text-white"
            >
              Show Completed
            </button>
          </div>
          <ul className="my-4 list-none">{this.renderItems()}</ul>
          <p className="text-gray-500">{this.leftItemCount}Items Left</p>
          <div className="flex mt-4">
            <button
              onClick={(e) => this.checkAll(e)}
              className="flex-1 border border-gray-200 px-8 py-2 mr-4 hover:bg-blue-400 hover:text-white"
            >
              {this.leftItemCount === 0? "Uncheck All" : "Check All"}
            </button>
            <button
              onClick={() => this.clearCompleted()}
              className="flex-1 border border-gray-200 px-8 py-2 hover:bg-blue-400 hover:text-white"
            >
              Clear Completed
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
