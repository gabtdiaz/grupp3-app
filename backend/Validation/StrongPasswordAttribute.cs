using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace grupp3_app.Api.Validation;

public class StrongPasswordAttribute : ValidationAttribute
{
    public StrongPasswordAttribute()
    {
        ErrorMessage = "Lösenordet måste vara minst 8 tecken långt och innehålla minst en versal, en gemen och en siffra.";
    }

    public override bool IsValid(object? value)
    {
        if (value is not string password)
            return false;

        if (password.Length < 8)
            return false;

        // At least one uppercase
        if (!Regex.IsMatch(password, @"[A-Z]"))
            return false;

        // At least one lowercase
        if (!Regex.IsMatch(password, @"[a-z]"))
            return false;

        // At least one number
        if (!Regex.IsMatch(password, @"[0-9]"))
            return false;

        return true;
    }
}