export default function (props) {
  const { selectedCustDisp, selectedCustDispOne } = props;

  const isBothEmpty =
    selectedCustDisp?.length === 0 && selectedCustDispOne?.length === 0;

  return (
    <div className="row engScroll">
      {isBothEmpty ? (
        <div className="col-md-12">None Selected</div>
      ) : (
        <>
          {selectedCustDisp}
          {selectedCustDispOne}
        </>
      )}
      {/* <div className="clearfix" style={{ height: '10px' }}></div> */}
    </div>
  );
}
