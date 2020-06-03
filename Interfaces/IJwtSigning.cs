using Microsoft.IdentityModel.Tokens;

namespace SecureStorage.Interfaces
{
    // Private key for signature
    public interface IJwtSigningEncodingKey
    {
        string SigningAlgorithm { get; }

        SecurityKey GetKey();
    }

    // Public key for signature verification
    public interface IJwtSigningDecodingKey
    {
        SecurityKey GetKey();
    }
}
