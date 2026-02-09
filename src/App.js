import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const defaultImgUrl = "https://i.pravatar.cc/48";

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const handleAddFriend = function (name, img) {
    setFriends(currFriends => [...currFriends, { id: crypto.randomUUID(), name, image: img, balance: 0 }]);
    setShowAddFriend(false);
  }

  const handleFriendSelection = function (friendId) {
    setSelectedFriendId(friendId === selectedFriendId ? null : friendId);
    setShowAddFriend(false);
  }

  const handleButtonAddFriendClick = function () {
    setShowAddFriend(show => !show);
    setSelectedFriendId(null);
  }

  const handleBalanceUpdate = function (amount) {
    setFriends(currFriends => currFriends.map(friend =>
      friend.id === selectedFriendId ? { ...friend, balance: friend.balance + amount } : friend
    ));
  }

  return <div className="app">
    <div className="sidebar">
      <FriendsList friends={friends} selectedFriendId={selectedFriendId} handleFriendSelection={handleFriendSelection} />
      {showAddFriend && <FormAddFriend onSubmit={handleAddFriend} />}
      <Button onClick={handleButtonAddFriendClick}>{showAddFriend ? 'Close' : 'Add friend'}</Button>
    </div>
    {selectedFriendId && <FormSplitBill key={selectedFriendId} friend={friends.find(friend => friend.id === selectedFriendId)} onBalanceUpdate={handleBalanceUpdate} />}
  </div >
}

function FriendsList({ friends, selectedFriendId, handleFriendSelection }) {

  return <ul>
    {friends.map(friend =>
      <li key={friend.id} className={selectedFriendId === friend.id ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && <p className="red">You own {friend.name} ${Math.abs(friend.balance)}</p>}
        {friend.balance > 0 && <p className="green">{friend.name} ows you ${friend.balance}</p>}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}

        <Button onClick={() => handleFriendSelection(friend.id)}>{selectedFriendId === friend.id ? 'Close' : 'Select'}</Button>
      </li>)}
  </ul>
}

function FormAddFriend({ onSubmit }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState(defaultImgUrl);
  const [formError, setFormError] = useState("");


  const handleFormSubmit = function (e) {
    e.preventDefault();
    // validate input - show error if any of the fields is empty
    if (!name.trim() || !img.trim()) {
      setFormError("input fields cannot be empty");
      return;
    };
    // submit the form
    onSubmit(name, img);
    // clear the input frields & error
    setName("");
    setImg(defaultImgUrl);
    setFormError("");
  }

  return <form onSubmit={handleFormSubmit} className="form-add-friend">
    <label htmlFor="friend-name">👯 Friend name</label>
    <input type="text" title="friend-name" name="friend-name" value={name} onChange={(e) => setName(e.target.value)} />

    <label htmlFor="friend-img">💁‍♀️ Image url</label>
    <input type="text" title="friend-img" name="friend-img" value={img} onChange={(e) => setImg(e.target.value)} />

    {formError && <p className="red">{formError}</p>}

    <Button>Add</Button>

  </form>
}

function FormSplitBill({ friend, onBalanceUpdate }) {
  const [bill, setBill] = useState("");
  const [userToPay, setUserToPay] = useState("");
  const [whoPays, setWhoPays] = useState("user");
  const friendToPay = bill ? bill - userToPay : "";

  const handleBillChange = function (input) {
    if (input < 0) return;
    setBill(input);
  }

  const handleUserExpenseChange = function (input) {
    if (input < 0 || input > bill) return;
    setUserToPay(input);
  }

  const handleSplitBill = function (e) {
    e.preventDefault();

    // validate input
    if (!bill || !userToPay) return;

    // submit the balance change
    const balanceChange = whoPays === "user" ? friendToPay : -userToPay;
    onBalanceUpdate(balanceChange);

    // reset the form
    setBill("");
    setUserToPay("");
    setWhoPays("");
  }

  return <form className="form-split-bill" onSubmit={handleSplitBill}>
    <h2>Split a bill with {friend.name}</h2>

    <label htmlFor="bill-amount">💸 Bill value</label>
    <input type="number" title="bill-amount" name="bill-amount" min={0} value={bill} onChange={(e) => handleBillChange(+e.target.value)} />

    <label htmlFor="expense-user">🐣 Your expense</label>
    <input type="number" title="expense-user" name="expense-user" min={0} value={userToPay} onChange={(e) => handleUserExpenseChange(+e.target.value)} />

    <label htmlFor="expense-friend">🤠 {friend.name}'s expense</label>
    <input type="number" title="expense-friend" name="expense-friend" disabled value={friendToPay} />

    <label htmlFor="who-pays">🦉 Who is paying the bill</label>
    <select title="who-pays" name="who-pays" value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
      <option value="user">You</option>
      <option value="friend">{friend.name}</option>
    </select>

    <Button>Split bill</Button>
  </form>
}

function Button({ onClick, children }) {
  return <button onClick={onClick} className="button">{children}</button>
}
