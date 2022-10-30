const switchedColors: Record<string, string> = {
    blue: '#c3c6ff',
    red: '#c8ffed',
    yellow: '#f3b4ff',
    green: '#ffd6e4',
}

export const Loader = (): JSX.Element => {
    return (
        <div className="preloader-wrapper big active">  
            {Object.keys(switchedColors).map(color => (
                <div key={color} className={`spinner-layer spinner-${color}`} style={
                    {borderColor: switchedColors[color as string], borderWidth: 8}}>
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div><div className="gap-patch">
                        <div className="circle"></div>
                    </div><div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                </div>
            ))}             
        </div>
    )
}