export default function ContentTitle({title, subtitle}){
    return(
    <div className="contentTitle text-primary">
        {title.toUpperCase() && (
        <div>
              <h1 className="text-3xl font-bold text-primary">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
          </div>
      )}
    </div>   
    )
}