export default function WhatsAppIcon({ 
  phoneNumber, 
  size = 28,
  style = {},
  className = '',
  title = 'Enviar mensaje por WhatsApp'
}) {
  const handleWhatsAppClick = () => {
    if (phoneNumber) {
      // Remove any non-numeric characters and ensure it starts with country code
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      if (cleanNumber) {
        const whatsappUrl = `https://wa.me/${cleanNumber}`;
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  if (!phoneNumber) return null;

  return (
    <button
      type="button"
      onClick={handleWhatsAppClick}
      className={className}
      style={{
        background: '#25D366',
        border: 'none',
        borderRadius: '50%',
        color: 'white',
        cursor: 'pointer',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.32}px`,
        transition: 'background-color 0.2s',
        padding: 0,
        ...style
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#128C7E';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#25D366';
      }}
      title={title}
    >
      <i className="fab fa-whatsapp"></i>
    </button>
  );
}

