using System.ComponentModel.DataAnnotations;
using grupp3_app.Api.Models;
using grupp3_app.Api.Validation;

namespace grupp3_app.Api.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Email must contain @ and a domain with a dot")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StrongPassword]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [MinLength(2, ErrorMessage = "Last name must be at least 2 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Date of birth is required")]
    [MinimumAge(18)]
    public DateTime DateOfBirth { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public Gender Gender { get; set; }

    [Required(ErrorMessage = "City is required")]
    public string City { get; set; } = string.Empty;

}