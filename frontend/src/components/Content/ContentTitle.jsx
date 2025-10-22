export default function ContentTitle({title, subtitle}){
    return(
    <div className="contentTitle">
        <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    </div>   
    )
}