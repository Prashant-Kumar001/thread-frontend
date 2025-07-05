import React from 'react'

const ErrorFallback = ({ msg, details, onRetry }) => {
    return (
        <div>
            <h2>Error: {msg}</h2>
            {details && <p>Details: {details}</p>}
            {onRetry && <button onClick={onRetry}>Retry</button>}
        </div>
    )
}

export default ErrorFallback