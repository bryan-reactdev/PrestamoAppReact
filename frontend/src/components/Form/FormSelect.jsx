export default function FormSelect({classNames, label, placeholder='Selecciona una opción...', children, required = false, ...props}) {
    return( 
        <div className={`form-field ${classNames}`}>
            <label>{label}</label>
            <div className="form-field-input-container">
                <select required={required} {...props}>
                    <option value="" disabled hidden>{placeholder}</option>
                    {children}
                </select>
            </div>
        </div>
    )
}