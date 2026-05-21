const Navbar = () => {
  return (
    <div style={{ padding: "10px", background: "#444", color: "#fff" , paddingLeft: "40px"  }}>
      <h3 style={{ fontSize: "20px", fontWeight: "bold"}}>MediQ</h3>
      <div style={{ position: "absolute", right: "20px", top: "10px",  justifyContent: "center", alignItems: "center"}}>
        <span style={{ Top: "14px", marginRight: "15px", fontWeight: "bold", cursor: "pointer" }}>Clear Chat</span>
       
      </div>
    </div>
  );
};

export default Navbar;