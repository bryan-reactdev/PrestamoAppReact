export default function FormField({classNames, label, type='text', ...props}) {
    const isMoney = type === 'money';

    return( 
        <div className={`form-field ${classNames}`}>
            <label>{label}</label>
            <div className="form-field-input-container">
                {isMoney &&
                    <i className="fas fa-dollar-sign"></i>
                }
                <input type={isMoney ? 'number' : type} step={isMoney ? 0.01 : 1} {...props}/>
            </div>
        </div>
    )
}