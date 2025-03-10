function InputBar({
    iconSize = "text-lg",
    Icon = "fas fa-search",
    placeholder = "Search for destinations or activities...",
    width = "w-full",
  }) {
    return (
      <div className={`input-bar-container ${width}`}>
        <span className={`input-bar-icon ${iconSize}`}>
          <i className={Icon}></i>
        </span>
        <input
          type="text"
          placeholder={placeholder}
          className="input-bar"
        />
      </div>
    );
  }
  
  export default InputBar;