export default function (props) {
  const { newMemberDropdown } = props;
  return (
    <div className="row engScroll">
      {newMemberDropdown.length === 0 ? (
        <div className="col-md-12">None Selected</div>
      ) : (
        // newMemberDropdown
        // {newMemberDropdown}

        <input type="checkbox"></input>
      )}
    </div>
  );
}
