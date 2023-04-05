const Notification = ({isError, message}) => {
    if (message === null){
        return null
    }
    let styling = "notification"
    if(isError){
        styling = "error"
    }

    return (
        <div className={styling}>
            {message}
        </div>
    )
}

export default Notification
